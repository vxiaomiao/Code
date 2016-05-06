using UnityEngine;
using System.Collections;

public class PlayerShooting : MonoBehaviour {


	//gongjishanghai
	public int damagePerShot = 20;

	//meifazidande shijian jiange
	public float timeBetweenBullets = 0.15f;

	//kaihuo fanwei
	public float range = 100f;

	AudioSource gunAudio;

	//jishiqi
	float timer;

	//shexian
	Ray shootRay;

	//baocun shexian pengzhuang de jieguo xinxi
	RaycastHit shootHit;

	int shootableMask;

	ParticleSystem gunParticles;
	LineRenderer gunLine;
	Light gunLight;

	//qiangzhi kaihuo shi bofangxiaoguo de chixu shijian de baifenbi
	float effectsDisplayTime = 0.2f;

	// Use this for initialization
	void Awake () {
	
		shootableMask = LayerMask.GetMask ("Shootable");

		gunParticles = GetComponent <ParticleSystem> ();
		gunLine = GetComponent <LineRenderer> ();
		gunAudio = GetComponent <AudioSource> ();
		gunLight = GetComponent <Light> ();
	}
	
	// Update is called once per frame
	void Update () {

		timer += Time.deltaTime;

		if (Input.GetButton("Fire1") && timer >= timeBetweenBullets && Time.timeScale != 0){
			shoot ();	
		}

		if (timer >= timeBetweenBullets * effectsDisplayTime){
			DisableEffects ();
		}
	
	}

	public void DisableEffects(){
		gunLine.enabled = false;
		gunLight.enabled = false;
	}

	void shoot(){

		timer = 0f;

		gunAudio.Play ();

		gunLight.enabled = true;

		gunParticles.Stop ();
		gunParticles.Play ();

		gunLine.enabled = true;

		//xianxuanranqi de diyige dianweizhi xinxi
		gunLine.SetPosition (0, transform.position);

		//goujian shexian de weizhi
		shootRay.origin = transform.position;
		//goujian shexian de fangxiang
		shootRay.direction = transform.forward;

		if (Physics.Raycast (shootRay, out shootHit, range, shootableMask)) {

			EnemyHealth enemyHealth = shootHit.collider.GetComponent <EnemyHealth> ();

			//ruguo enemyHealth buweikong, shuoming pengdaole diren, 
			//bing rang diren shoudao shanghai
			if (enemyHealth != null) {
				enemyHealth.TakeDamage (damagePerShot, shootHit.point);
			}

			//shezhi xianxuanranqi de dierge weizhi xinxi ,gouchengxianduan
			gunLine.SetPosition (1, shootHit.point);
		}
		else {
			//shezhi xianxuanranqi de dierge weizhi xinxi(nenggou daoda de zuiyuan de weizhi),
			//bing goucheng xianduan
			gunLine.SetPosition (1, shootRay.origin + shootRay.direction * range);
		}

	}
}
