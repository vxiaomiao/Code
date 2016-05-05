using UnityEngine;
using System.Collections;

public class EnemyHealth : MonoBehaviour {


	public int startHealth = 100;
	public int currentHealth;
	public float sinkSpeed = 2.5f;
	public AudioClip deathClip;

	AudioSource enemyAudio;
	//sheji lizi xiaoguo 
	ParticleSystem hitParticles;

	Animator anima;
	bool isDead;

	bool isSinking;

	CapsuleCollider capsuleCollider;

	// Use this for initialization
	void Awake () {
	
		anima = GetComponent <Animator> ();
		enemyAudio = GetComponent <AudioSource> ();
		capsuleCollider = GetComponent <CapsuleCollider> ();

		hitParticles = GetComponentInChildren <ParticleSystem> ();

		currentHealth = startHealth;
	}

	void Update(){

		//shifou neng xiachen
		if (isSinking){
			transform.Translate (-Vector3.up * sinkSpeed * Time.deltaTime);
		}
	
	}

	public void TakeDamage(int amount, Vector3 hitPoint){

		if (isDead){
			return;
		}

		currentHealth -= amount;

		//shezhi lizi xiaoguo bofang de weizhi
		hitParticles.transform.position = hitPoint;

		enemyAudio.Play ();

		//hitParticles.Stop ();
		hitParticles.Play ();

		if(currentHealth <= 0){

			Death ();
		}
	}

	void Death(){

		isDead = true;

		//变成触发器， 不会挡住子弹光线
		capsuleCollider.isTrigger = true;

		//死亡动画
		anima.SetTrigger ("Dead");

		enemyAudio.clip = deathClip;
		enemyAudio.Play ();	
	}

	public void StartSinking(){

		//guanbi daohang 
		GetComponent <NavMeshAgent> ().enabled = false;

		//shoudao donglixue de yingxiang
		GetComponent <Rigidbody> ().isKinematic = true;
		isSinking = true;

		//xiaohui guaiwu 
		Destroy (gameObject, 2f);
	}

}
